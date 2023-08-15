package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

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

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = RecommendationRequestController.class)
@Import(TestConfig.class)
public class RecommendationRequestControllerTests extends ControllerTestCase {
    
    @MockBean
    RecommendationRequestRepository recommendationRequestRepository;

    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/RecommendationRequest/admin/all

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/RecommendationRequest/all"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
            mockMvc.perform(get("/api/RecommendationRequest/all"))
                            .andExpect(status().is(200)); // logged
    }

    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
            mockMvc.perform(get("/api/RecommendationRequest?id=123"))
                            .andExpect(status().is(403)); // logged out users can't get by id
    }

    // Authorization tests for /api/RecommendationRequest/post
    // (Perhaps should also have these for put and delete)

    @Test
    public void logged_out_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/RecommendationRequest/post"))
                            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/RecommendationRequest/post"))
                            .andExpect(status().is(403)); // only admins can post
    }

    // Tests with mocks for database actions

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

        // arrange
        LocalDateTime dateRequested = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime dateNeeded = LocalDateTime.parse("2022-01-10T00:00:00");

        RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                .requesterEmail("@student")
                .professorEmail("@professor")
                .explanation("explanation")
                .dateRequested(dateRequested)
                .dateNeeded(dateNeeded)
                .done(false)
                .build();

                when(recommendationRequestRepository.findById(eq(123L))).thenReturn(Optional.of(recommendationRequest1));

        // act
        MvcResult response = mockMvc.perform(get("/api/RecommendationRequest?id=123"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(recommendationRequestRepository, times(1)).findById(eq(123L));
        String expectedJson = mapper.writeValueAsString(recommendationRequest1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

        // arrange

        when(recommendationRequestRepository.findById(eq(123L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/RecommendationRequest?id=123"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(recommendationRequestRepository, times(1)).findById(eq(123L));
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("RecommendationRequest with id 123 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_recommendation_requests() throws Exception {

        // arrange
        LocalDateTime dateRequested1 = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime dateNeeded1 = LocalDateTime.parse("2022-01-10T00:00:00");

        RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                .requesterEmail("@student1")
                .professorEmail("@professor1")
                .explanation("explanation1")
                .dateRequested(dateRequested1)
                .dateNeeded(dateNeeded1)
                .done(false)
                .build();

        LocalDateTime dateRequested2 = LocalDateTime.parse("2022-03-11T00:00:00");
        LocalDateTime dateNeeded2 = LocalDateTime.parse("2022-03-18T00:00:00");

        RecommendationRequest recommendationRequest2 = RecommendationRequest.builder()
                .requesterEmail("@student2")
                .professorEmail("@professor2")
                .explanation("explanation2")
                .dateRequested(dateRequested2)
                .dateNeeded(dateNeeded2)
                .done(true)
                .build();

        ArrayList<RecommendationRequest> expectedRequests = new ArrayList<>();
        expectedRequests.addAll(Arrays.asList(recommendationRequest1, recommendationRequest2));

        when(recommendationRequestRepository.findAll()).thenReturn(expectedRequests);

        // act
        MvcResult response = mockMvc.perform(get("/api/RecommendationRequest/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(recommendationRequestRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedRequests);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_recommendation_request() throws Exception {
        // arrange

        LocalDateTime dateRequested = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime dateNeeded = LocalDateTime.parse("2022-01-10T00:00:00");

        RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                .requesterEmail("@student")
                .professorEmail("@professor")
                .explanation("explanation")
                .dateRequested(dateRequested)
                .dateNeeded(dateNeeded)
                .done(true)
                .build();
            
            
        when(recommendationRequestRepository.save(eq(recommendationRequest1))).thenReturn(recommendationRequest1);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/RecommendationRequest/post?requesterEmail=@student&professorEmail=@professor&explanation=explanation&dateRequested=2022-01-03T00:00:00&dateNeeded=2022-01-10T00:00:00&done=true")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(recommendationRequestRepository, times(1)).save(recommendationRequest1);
        String expectedJson = mapper.writeValueAsString(recommendationRequest1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_a_date() throws Exception {
        // arrange

        LocalDateTime dateRequested1 = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime dateNeeded1 = LocalDateTime.parse("2022-01-10T00:00:00");

        RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                .requesterEmail("@student")
                .professorEmail("@professor")
                .explanation("explanation")
                .dateRequested(dateRequested1)
                .dateNeeded(dateNeeded1)
                .done(false)
                .build();

        when(recommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.of(recommendationRequest1));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/RecommendationRequest?id=15")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(recommendationRequestRepository, times(1)).findById(15L);
        verify(recommendationRequestRepository, times(1)).delete(any());

        Map<String, Object> json = responseToJson(response);
        assertEquals("RecommendationRequest with id 15 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_tries_to_delete_non_existant_recommendation_request_and_gets_right_error_message()
            throws Exception {
        // arrange

        when(recommendationRequestRepository.findById(eq(15L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/RecommendationRequest?id=15")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(recommendationRequestRepository, times(1)).findById(15L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("RecommendationRequest with id 15 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_recommendation_request() throws Exception {
        // arrange

        LocalDateTime dateRequested1 = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime dateNeeded1 = LocalDateTime.parse("2022-01-10T00:00:00");
        LocalDateTime dateRequested2 = LocalDateTime.parse("2022-03-11T00:00:00");
        LocalDateTime dateNeeded2 = LocalDateTime.parse("2022-03-18T00:00:00");

        RecommendationRequest recommendationRequestOrig = RecommendationRequest.builder()
                .requesterEmail("@student1")
                .professorEmail("@professor1")
                .explanation("explanation1")
                .dateRequested(dateRequested1)
                .dateNeeded(dateNeeded1)
                .done(false)
                .build();

        RecommendationRequest recommendationRequestEdited = RecommendationRequest.builder()
                .requesterEmail("@student2")
                .professorEmail("@professor2")
                .explanation("explanation2")
                .dateRequested(dateRequested2)
                .dateNeeded(dateNeeded2)
                .done(true)
                .build();

        String requestBody = mapper.writeValueAsString(recommendationRequestEdited);

        when(recommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.of(recommendationRequestOrig));

        // act
        MvcResult response = mockMvc.perform(
                put("/api/RecommendationRequest?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(recommendationRequestRepository, times(1)).findById(67L);
        verify(recommendationRequestRepository, times(1)).save(recommendationRequestEdited); // should be saved with correct user
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_recommendation_request_that_does_not_exist() throws Exception {
            // arrange

        LocalDateTime dateRequested1 = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime dateNeeded1 = LocalDateTime.parse("2022-01-10T00:00:00");

        RecommendationRequest recommendationEditedRequest = RecommendationRequest.builder()
                .requesterEmail("@student")
                .professorEmail("@professor")
                .explanation("explanation")
                .dateRequested(dateRequested1)
                .dateNeeded(dateNeeded1)
                .done(false)
                .build();

        String requestBody = mapper.writeValueAsString(recommendationEditedRequest);

        when(recommendationRequestRepository.findById(eq(67L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                put("/api/RecommendationRequest?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(recommendationRequestRepository, times(1)).findById(67L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("RecommendationRequest with id 67 not found", json.get("message"));
    }
}
