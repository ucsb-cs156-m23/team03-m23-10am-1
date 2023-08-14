package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
// import edu.ucsb.cs156.example.entities.UCSBDiningCommons;
// import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsRepository;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = MenuItemReviewController.class)
@Import(TestConfig.class)
public class MenuItemReviewControllerTests extends ControllerTestCase {

        @MockBean
        MenuItemReviewRepository menuItemReviewRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/ucsbdiningcommons/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/menuitemreview/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/menuitemreview/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/menuitemreview?id=1"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/ucsbdiningcommons/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/menuitemreview/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/menuitemreview/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                MenuItemReview review = MenuItemReview.builder()
                                .id(1L)
                                .itemId(1L)
                                .email("test@ucsb.edu")
                                .stars(5)
                                .dateReviewed(LocalDateTime.of(2023, 8, 1, 12, 0, 0))
                                .comments("Good")
                                .build();

                when(menuItemReviewRepository.findById(1L)).thenReturn(Optional.of(review));

                // act
                MvcResult response = mockMvc.perform(get("/api/menuitemreview?id=1"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(menuItemReviewRepository, times(1)).findById(1L);
                String expectedJson = mapper.writeValueAsString(review);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(menuItemReviewRepository.findById(1L)).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/menuitemreview?id=1"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(menuItemReviewRepository, times(1)).findById(1L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("MenuItemReview with id 1 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_ucsbdiningcommons() throws Exception {

                // arrange

                MenuItemReview one = MenuItemReview.builder()
                                .id(1L)
                                .itemId(1L)
                                .email("test@ucsb.edu")
                                .stars(5)
                                .dateReviewed(LocalDateTime.of(2023, 8, 1, 12, 0, 0))
                                .comments("Good")
                                .build();

                MenuItemReview two = MenuItemReview.builder()
                                .id(2L)
                                .itemId(2L)
                                .email("test@ucsb.edu")
                                .stars(5)
                                .dateReviewed(LocalDateTime.of(2023, 8, 1, 12, 0, 0))
                                .comments("Good")
                                .build();

                ArrayList<MenuItemReview> expectedReviews = new ArrayList<>();
                expectedReviews.addAll(Arrays.asList(one, two));

                when(menuItemReviewRepository.findAll()).thenReturn(expectedReviews);

                // act
                MvcResult response = mockMvc.perform(get("/api/menuitemreview/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(menuItemReviewRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedReviews);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_review() throws Exception {
                // arrange

                // MenuItemReview one = MenuItemReview.builder()
                //                 .id(1L)
                //                 .itemId(1L)
                //                 .email("test@ucsb.edu")
                //                 .stars(5)
                //                 .dateReviewed(LocalDateTime.of(2023, 8, 1, 12, 0, 0))
                //                 .comments("Good")
                //                 .build();

                // when(menuItemReviewRepository.save(eq(one))).thenReturn(one);

                // // act
                // MvcResult response = mockMvc.perform(
                //                 post("/api/menuitemreview/post?id=1&itemId=1&email=test@ucsb.edu&stars=5&datereviewed=2023-08-01T12:00:00&comments=Good")
                //                                 .with(csrf()))
                //                 .andExpect(status().isOk()).andReturn();

                // // assert
                // verify(menuItemReviewRepository, times(1)).save(one);
                // String expectedJson = mapper.writeValueAsString(one);
                // String responseString = response.getResponse().getContentAsString();
                // assertEquals(expectedJson, responseString);
                MenuItemReview menuItemReview = MenuItemReview.builder()
                        .itemId(1L)
                        .email("test@ucsb.edu")
                        .stars(5)
                        .dateReviewed(LocalDateTime.of(2021, 5, 1, 12, 0, 0))
                        .comments("This is a test")
                        .build();
            
                when(menuItemReviewRepository.save(eq(menuItemReview))).thenReturn(menuItemReview);
                
                // act
                MvcResult response = mockMvc.perform(
                        post("/api/menuitemreview/post?itemId=1&email=test@ucsb.edu&stars=5&dateReviewed=2021-05-01T12:00:00&comments=This is a test")
                        .with(csrf()))
                        .andExpect(status().isOk()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).save(menuItemReview);
                String expectedJson = mapper.writeValueAsString(menuItemReview);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_date() throws Exception {
                // arrange

                MenuItemReview one = MenuItemReview.builder()
                                .id(1L)
                                .itemId(1L)
                                .email("test@ucsb.edu")
                                .stars(5)
                                .dateReviewed(LocalDateTime.of(2023, 8, 1, 12, 0, 0))
                                .comments("Good")
                                .build();

                when(menuItemReviewRepository.findById(1L)).thenReturn(Optional.of(one));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/menuitemreview?id=1")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).findById(1L);
                verify(menuItemReviewRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("MenuItemReview with id 1 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_commons_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(menuItemReviewRepository.findById(2L)).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/menuitemreview?id=2")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).findById(2L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("MenuItemReview with id 2 not found", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_review() throws Exception {
                // arrange

                MenuItemReview oneOrig = MenuItemReview.builder()
                                .id(1L)
                                .itemId(1L)
                                .email("test@ucsb.edu")
                                .stars(4)
                                .dateReviewed(LocalDateTime.of(2023, 8, 1, 12, 0, 0))
                                .comments("Good")
                                .build();

                MenuItemReview oneEdited = MenuItemReview.builder()
                                .id(1L)
                                .itemId(1L)
                                .email("test@ucsb.edu")
                                .stars(5)
                                .dateReviewed(LocalDateTime.of(2023, 8, 1, 12, 0, 0))
                                .comments("Good")
                                .build();

                String requestBody = mapper.writeValueAsString(oneEdited);

                when(menuItemReviewRepository.findById(1L)).thenReturn(Optional.of(oneOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/menuitemreview?id=1")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).findById(1L);
                verify(menuItemReviewRepository, times(1)).save(oneEdited); // should be saved with updated info
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_review_that_does_not_exist() throws Exception {
                // arrange

                MenuItemReview twoEdited = MenuItemReview.builder()
                                .id(2L)
                                .itemId(2L)
                                .email("test@ucsb.edu")
                                .stars(5)
                                .dateReviewed(LocalDateTime.of(2023, 8, 1, 12, 0, 0))
                                .comments("Good")
                                .build();

                String requestBody = mapper.writeValueAsString(twoEdited);

                when(menuItemReviewRepository.findById(2L)).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/menuitemreview?id=2")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(menuItemReviewRepository, times(1)).findById(2L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("MenuItemReview with id 2 not found", json.get("message"));

        }

        @WithMockUser(roles = {"ADMIN", "USER"})
        @Test
        public void admin_can_edit_an_existing_menuitemreview() throws Exception {
            // arrange
            MenuItemReview menuItemReview = MenuItemReview.builder()
                .itemId(1L)
                .email("test@ucsb.edu")
                .stars(5)
                .dateReviewed(LocalDateTime.of(2021, 5, 1, 12, 0, 0))
                .comments("This is a test")
                .build();

            MenuItemReview menuItemReview2 = MenuItemReview.builder()
                .itemId(2L)
                .email("test2@ucsb.edu")
                .stars(4)
                .dateReviewed(LocalDateTime.of(2021, 5, 2, 12, 0, 0))
                .comments("This is a test 2")
                .build();

            String requestBody = mapper.writeValueAsString(menuItemReview2);

            when(menuItemReviewRepository.findById(eq(1L))).thenReturn(Optional.of(menuItemReview));

            // act
            MvcResult response = mockMvc.perform(
                put("/api/menuitemreview?id=1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8")
                    .content(requestBody)
                    .with(csrf()))
                .andExpect(status().isOk()).andReturn();

            // assert
            verify(menuItemReviewRepository, times(1)).findById(1L);
            verify(menuItemReviewRepository, times(1)).save(menuItemReview2);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(requestBody, responseString);
        }

}
